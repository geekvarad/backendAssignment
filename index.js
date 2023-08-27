const HistoryResponse = require('./entity/historyResponse');
const  EndpointsResponse = require('./entity/endpointsResponse');
const OperatorResponse = require('./entity/operatorResponse');

const express = require('express');
const fs = require('fs');
const app = express(); 

var endPoints = ["/","/history", "/{5}/plus/{6} where 5,6 can be any value, operands supported are \"plus,minus,into,divide\" and endpoint can be of any length"];

app.get("/history",(_,res) => {
const filePath = 'history.txt';

fs.readFile(filePath, 'utf8', (err, data) => {

  if (err) {
    console.error('Error reading the file:', err);
    return;
  }
  res.json(new HistoryResponse(data))
});
});

app.get('/:calculator(*)', (req, res) => {
    const remainingUrl = req.params.calculator;
    if(remainingUrl.length == 0){
        res.json(new EndpointsResponse(endPoints));
        return;
    }
    var oeratorsAndOperands = remainingUrl.split("/");
    var expression = "";
    for(let i = 0; i<oeratorsAndOperands.length; i++){
        switch (oeratorsAndOperands[i]) {
            case "plus":
                expression = expression + "+";
                break;
            case "minus":
                expression = expression + "-";
                break;
            case "into":
                expression = expression + "*";
                break;
            case "divide":
                expression = expression + "/";
                break;
            default:
                expression = expression + oeratorsAndOperands[i];
                break;
        }
    }
    const result = eval(expression);
    const filePath = 'history.txt';

    fs.readFile(filePath, 'utf8', (err, data) => {

    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    const numberOfNewLines = (data.match(/\n/g) || []).length;
    if(numberOfNewLines == 20){
        data = data.substring(data.indexOf("\n")+1)

    }
    data = data + expression + "\n";
    fs.writeFile(filePath, data, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to the file:', err);
          return;
        }

        console.log('File has been written successfully.');
      });
});
    res.json(new OperatorResponse(expression,result));
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
