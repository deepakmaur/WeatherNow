const fs=require("fs")
const http=require("http")
const requests=require("requests")
//const { json } = require("stream/consumers")



const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp)
    temperature=temperature.replace("{%tempmin}",orgVal.main.temp_min)
    temperature=temperature.replace("{%tempmax}",orgVal.main.temp_max)
    temperature=temperature.replace("{%location%}",orgVal.name)
    temperature=temperature.replace("{%country%}",orgVal.sys.country)
    temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main)
    return temperature

}

const homeFile=fs.readFileSync("index.html","utf-8")
const server=http.createServer((req,res)=>{
    // var c=city.value;
    // city.value=" ";
    requests(`https://api.openweathermap.org/data/2.5/weather?q=Noida&appid=6dca116c6e6240ef8cdc9fe1f5b1d6fc`)
    .on('data',  (chunk)=> {
        const objdata=JSON.parse(chunk)  // Converting Chunk data into Json format
        const ardata=[objdata];// Json-> array
        //console.log(ardata[0].main.temp)
        // Converting to map so that we can get value easily
        const realTimeData=ardata.map((val)=>replaceVal(homeFile,val)).join("")
            //console.log(realTimeData)
        
        res.write(realTimeData);
    })
    .on('end',  (err) =>{
    if (err) return console.log('connection closed due to errors', err);
    
    res.end();
    });

})

server.listen(8080,"127.0.0.1")