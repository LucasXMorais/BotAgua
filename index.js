// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

//fs é função para poder escrever arquivos
const fs = require('fs');

venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    console.log(String(message.chat.name + ", " + message.sender.name));

    if (message.chat.name === 'Hidrajelsons' && message.body.replace(/ /g, "").charAt(0) === '+') {
      var txt = altBebido(message);
      console.log(txt);
      client
        .sendText(message.from, txt)
        .then((result) => {
        console.log(txt); //return object success
        })
        .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
        });
    }
    if (message.chat.name === 'Hidrajelsons' && message.caption.replace(/ /g, "").charAt(0) === '+') {
      var txt = altBebidoFoto(message);
      console.log(txt);
      client
        .sendText(message.from, txt)
        .then((result) => {
        console.log(txt); //return object success
        })
        .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
        });
    }
    if (message.chat.name === 'Pedro Lucas EJEL' && message.body.replace(/ /g, "").toLowerCase() == 'zerar') {      
      var txt = zerar();   
      console.log(txt);
      client
        .sendText(message.from, txt)
        .then((result) => {
        console.log('zerado!!'); //return object success
      })
        .catch((erro) => {
       console.error('Error when sending: ', erro); //return object error
       });        
    }
    //if (message.chat.name === 'Teste' && message.body.replace(/ /g, "").charAt(0) === '+') {
    //  var txt = altBebido(message);
    //  console.log(txt);
    //  client
    //    .sendText(message.from, txt)
    //    .then((result) => {
    //    console.log(txt); //return object success
    //    })
    //    .catch((erro) => {
    //    console.error('Error when sending: ', erro); //return object error
    //    });
    //}
    //if (message.chat.name === 'Família M ❤' && message.body.replace(/ /g, "").slice(0,4) === 'top3') {
    //  var txt = ranking();    
    //  client
    //    .sendText(message.from, txt)
    //    .then((result) => {
    //    console.log(txt); //return object success
    //    })
    //    .catch((erro) => {
    //    console.error('Error when sending: ', erro); //return object error
    //    });
    //}
  });
}

function altBebido(message){

    var qtd = String(message.body+"@");
    //Caso alguém marque outra pessoa na msg preciso tirar o @ e o nmr de celular
    var arroba = qtd.indexOf('@');
    qtd = qtd.slice(0,arroba+1);
    qtd = qtd.replace(/ /g, "");
    //Para ativar o bot basta colocar um + no início da msg
    if (qtd.charAt(0) === '+'){
        qtd = qtd.replace(/\D/g, "");
        if (qtd == null || qtd == "" || qtd == " ") {qtd = 0;}
    }

    var hidratados = []; //DB
    
    //Abrindo DB
    hidratados = require("./hidratados.json"); //DB

    var novoMembro = true;
    var i;
    //Checar se a pessoa já está no DB
    for (i = 0; i < hidratados.length; i++){
        if (message.sender.name === hidratados[i].membro){

            hidratados[i].bebido += parseInt(qtd);

            novoMembro = false;

            break
        }
    }

    //Se for membro novo eu adiciono ao DB
    if (novoMembro){   
        hidratados[i] = {
            membro: message.sender.name,
            bebido: parseInt(qtd)
        }
    }

    var txt = String('Bot: ' + hidratados[i].membro + ' já bebeu ' + hidratados[i].bebido + 'ml');

    //arrumar para modificar o DB
    hidratados = JSON.stringify(hidratados);
    fs.writeFileSync('./hidratados.json', hidratados);

    return txt;
}

function altBebidoFoto(message){

  var qtd = String(message.caption+"@");
  //Caso alguém marque outra pessoa na msg preciso tirar o @ e o nmr de celular
  var arroba = qtd.indexOf('@');
  qtd = qtd.slice(0,arroba+1); 
  qtd = qtd.replace(/ /g, "");   
  //Para ativar o bot basta colocar um + no início da msg
  if (qtd.charAt(0) === '+'){
      qtd = qtd.replace(/\D/g, "");
      if (qtd == null || qtd == "" || qtd == " ") {qtd = 0;}
  }

  var hidratados = []; //DB

  //Abrindo DB
  hidratados = require("./hidratados.json"); //DB

  var novoMembro = true;
  var i;
  //Checar se a pessoa já está no DB
  for (i = 0; i < hidratados.length; i++){
      if (message.sender.name === hidratados[i].membro){

          hidratados[i].bebido += parseInt(qtd);

          novoMembro = false;

          break
      }
  }

  //Se for membro novo eu adiciono ao DB
  if (novoMembro){   
      hidratados[i] = {
          membro: message.sender.name,
          bebido: parseInt(qtd)
      }
  }

  var txt = String('Bot: ' + hidratados[i].membro + ' já bebeu ' + hidratados[i].bebido + 'ml');

  //arrumar para modificar o DB
  hidratados = JSON.stringify(hidratados);
  fs.writeFileSync('./hidratados.json', hidratados);

  return txt;
}

function ranking(){
  //Abrindo DB
  var hidratados = require("./hidratados.json"); //DB

  var i;

  var prm = {membro: "", bebido: 0};
  var seg = {membro: "", bebido: 0};
  var ter = {membro: "", bebido: 0};

  for (i = 0; i < hidratados.length; i++){ 
    if (hidratados[i].bebido > prm.bebido){      
      ter.membro = seg.membro;
      ter.bebido = seg.bebido;
      seg.membro = prm.membro;
      seg.bebido = prm.bebido;
      prm.membro = hidratados[i].membro;
      prm.bebido = hidratados[i].bebido;      
    }else if (hidratados[i].bebido == prm.bebido){
      prm.membro = String(prm.membro+" "+hidratados[i].membro);
    } else if (hidratados[i].bebido > seg.bebido){      
      ter.membro = seg.membro;
      ter.bebido = seg.bebido;
      seg.membro = hidratados[i].membro;
      seg.bebido = hidratados[i].bebido;      
    }else if (hidratados[i].bebido == seg.bebido){
      seg.membro = String(seg.membro+" "+hidratados[i].membro);
    }else if (hidratados[i].bebido > ter.bebido){      
      ter.membro = hidratados[i].membro;
      ter.bebido = hidratados[i].bebido;
    }else if (hidratados[i].bebido == ter.bebido){
      ter.membro = String(ter.membro+" "+hidratados[i].membro);
    } 
  }
  var txt = String("Bot: 1°: "+prm.membro+" : "+prm.bebido+"ml \n2°: "+seg.membro+" : "+seg.bebido+"ml \n3°: "+ter.membro+" :"+ter.bebido+"ml");
  return txt;
}

function zerar(){
  var hidratados = require("./hidratados.json");

  var lista = "Semana zerada!\nLista Completa:\n";

  for (i = 0; i < hidratados.length; i++){
    lista = String(lista + hidratados[i].membro + " : " + hidratados[i].bebido + " ml\n"); 
  } 

  for (i = 0; i < hidratados.length; i++){
    hidratados[i].bebido = 0;
  } 
     
  hidratados = JSON.stringify(hidratados);
  fs.writeFileSync('./hidratados.json', hidratados);

  return lista;

}

//function resetar(){
//  var hidratados = require("./hidratadosbkp.json");
//
//  hidratados = JSON.stringify(hidratados);
//  fs.writeFileSync('./hidratados.json', hidratados);
//
//}