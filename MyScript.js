let doc,container,text,filter,filterSelect=null,maxResults=null,orderBy=null,langRestrict=null,arr=[];
window.onload = function(){ 
     doc = document;
     container = doc.getElementById('container');
     filter=doc.getElementById('fillter');
     text = doc.getElementById('textArea');
     text.addEventListener('keydown',(e)=>{
         if(e.keyCode===13){
             checkData();
         }
     })
    }
function checkData(){
  if(text.value.length>0){
      if(container.childNodes.length>0){
          cleanAll();
      }
    fetchData(text.value)
  }
}
function fetchData(str){ 
    fetch(ready()(str)).then(data=>{
    if(data.ok){
      return data.json()
    }
  }).then(data=>{
      if(typeof data.items!=='undefined'){
           printStrSearch(data.items.length,str);
    data.items.map(data=>{
        printAllBlock(data.volumeInfo.title,data.volumeInfo.authors,data.volumeInfo.publisher,data.volumeInfo.infoLink,data.volumeInfo.language,data.volumeInfo.imageLinks.thumbnail,data.volumeInfo.publishedDate,data.volumeInfo.description);
 
    })
      }else{
          cleanAll('0',str);
      }
     
  }).catch(err=>{
    console.log(err);
  })
}
function printStrSearch(length_,str) {
    let strSearch =doc.createElement('p');
    strSearch.appendChild(doc.createTextNode('we have found '+length_+' results for "'+str+'"'));
    strSearch.className='searchStr';
    container.appendChild(strSearch)
}
function printAllBlock(title,author,publised,infoUrl,language,imgSrc,date,content,str,lenghtArray){
      let url = doc.createElement('a');
      url.href=infoUrl;
      url.style.width='100%';
      let figura = doc.createElement('figure');
      figura.onmouseout=()=>{
        figura.style.opacity='1';
    }
    figura.onmouseover=()=>{
        figura.style.opacity='0.5';
    }
      figura.className="block";
      let img = doc.createElement('img');
      img.src=imgSrc;
      img.className='imgClass';
      figura.appendChild(img);
      let figuraCaption = doc.createElement('figcaption');
      createTextBlock(figuraCaption,'title: ',title)
  createTextBlock(figuraCaption,'author: ',author)
  createTextBlock(figuraCaption,'published: ',publised)
  createTextBlock(figuraCaption,'lang: ',language)
  createTextBlock(figuraCaption,'date: ',date)
  createTextBlock(figuraCaption,' content: ',content)
  figura.appendChild(figuraCaption);
  url.appendChild(figura);
  container.appendChild(url);
}
function createTextBlock(el,str,_text){
    if((typeof _text) ==='undefined'){
        _text='Havn`t info.';
    }
    if((typeof _text)==='object'){
        let buff ='';
        console.log(buff);
        _text.map(data=>{
            buff+=data+' ';
        })
        
        _text=buff;
    }
  let p = doc.createElement('p');
  let TextTitle = doc.createTextNode(str.toUpperCase());
  let TextContent = doc.createTextNode(_text.toUpperCase())
  let title =doc.createElement('span');
  title.className="nameMain";
  title.appendChild(TextTitle);
  let content = doc.createElement('span');
  content.className='textStyle';
  content.appendChild(TextContent);
  p.appendChild(title);
  p.appendChild(content);
  let br =doc.createElement('br');
  p.appendChild(br);
  el.appendChild(p);
}
function cleanAll() {
     let fc = container.firstChild;
     arr=[];
     filterSelect=null;
     maxResults=null;
     orderBy=null;
     langRestrict=null;
     while(fc){
         container.removeChild(fc);
         fc = container.firstChild;
        }
}
function dropFilter() {
    if(filter.className==='dropOpen'){
        filter.className='dropClose';
    }else{
        filter.className='dropOpen';
    }
}
function checkChenge(el) {
    console.log(el.value+' '+el.name)
    if(el.name==='filter'){
         filterSelect={type:el.name,value:el.value}
    }
    if(el.name==='langRestrict'){
        langRestrict={type:el.name,value:el.value}
    }
    if(el.name==='maxResults'){
        let numb =''+ el.value;
        console.log('typeof: '+typeof parseInt(numb)+' '+el.value)
        if(Number(el.value)<=48&&Number(el.value)>0){
            maxResults={type:el.name,value:el.value}
        }
    }
    if(el.name==='orderBy'){
        orderBy={type:el.name,value:el.value}
    }
   
}
function ready() {
    if(maxResults!==null){
        arr.push(maxResults);
    }
    if(langRestrict!==null){
        arr.push(langRestrict);
    }if(orderBy!==null){
         arr.push(orderBy);
    }
    if(filterSelect!==null){
        arr.push(filterSelect);
    } 
    return printA=(str)=>{
        let str_ ='https://www.googleapis.com/books/v1/volumes?q=search+intitle='+str;
    for(let i=0;i<arr.length;i++){
        str_+='+'+arr[i].type+'='+arr[i].value;
    }
    return str_;
    } 
}