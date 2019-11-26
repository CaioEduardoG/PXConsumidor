const { Consumer } = require('sqs-consumer');
const aws = require('aws-sdk');

if(!aws.config.region){
  aws.config.update({
    region: 'us-east-2'
  });
}

const dadosUser = new aws.DynamoDB.DocumentClient();
const sqs = new aws.SQS();

let pegarUrlFila = async() => {
  return await new Promise((resolve, reject) => {
    var nomeFila = {
      QueueName: `${process.env.NOME_FILA}`
    };
  
    sqs.getQueueUrl(nomeFila, (err, data) => {
      if (err) {
        reject({
          err: err,
          errStack: err.stack
        });
      }
      else {
        resolve({
          url: data.QueueUrl
        });
      }
    });
  });
}

let criarDocumento = (colaborador) => {
  var docColaborador = {
    TableName: `${process.env.NOMETABELA}`,
    Item: {
      "nome": colaborador.Nome,
      "email": colaborador.Email,
      "tribo": colaborador.Tribo,
      "clientes": colaborador.Clientes
    }
  };
  dadosUser.put(docColaborador, (err, data) => {
    if(err){
      console.log(err);
    }else{
      console.log(data);
    }
  });
}

pegarUrlFila().then(resolve => {
  let app = Consumer.create({
    queueUrl: resolve.url,
    messageAttributeNames: ['Nome', 'Email', 'Tribo', 'Clientes'],
    handleMessage: async (obj) => {
      var colaborador = {
        Nome: obj.MessageAttributes.Nome.StringValue,
        Email: obj.MessageAttributes.Email.StringValue,
        Tribo: obj.MessageAttributes.Tribo.StringValue,
        Clientes: obj.MessageAttributes.Clientes.StringValue
      };
      criarDocumento(colaborador);
    }
  });

  app.on(' erro ', (err) => {
    reject(err.mensagem);
  });

  app.on(' processing_error ', (err) => {
    reject(err.mensagem);
  });

  app.on(' timeout_error ', (err) => {
    reject(err.mensagem);
  });

  app.start();

}).catch(reject => { console.log(reject.err, reject.errStack); })