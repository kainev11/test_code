const fs = require('fs');
const cons = process.argv;
let language;
let mode = cons[2];
let keyWord = '';
if (mode == 'code') {
    keyWord = cons[cons.length - 2];
}
for (let i = 2; i < cons.length; i++) {
    if (cons[i] == 'en')
        language = 'en';
    if (cons[i] == 'ru')
        language = 'ru';
}
const inFile = cons[3];
const outFile = cons[4];
let str = '';

try {
    str = (fs.readFileSync(inFile, { encoding: 'utf-8' })).toLowerCase();
    if (str == '')
        throw e1;
}
catch (e) {
    console.log('Input file is empty or does not exist');
    return;
}

//for (let i = 1072; i < 1104; i++) {
//    ruAlph.push(String.fromCharCode(i));}
let alph;
let defIOC;
let mostComm;
if (language == 'ru') {
    alph = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ы', 'ъ', 'э', 'ю', 'я'];
    defIOC = 0.05;
    mostComm = 15;
}
else {
    alph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    defIOC = 0.06;
    mostComm = 4;
}
let res = '';
const n = alph.length;

function getText(keyWord) {
    let i = 0;
    for (let j = 0; j < keyWord.length && i < str.length; i++) {
        if (alph.indexOf(str[i]) != -1) {
            if (mode == 'code')
            res += alph[(alph.indexOf(str[i]) + alph.indexOf(keyWord[j])) % n];
            else
            res += alph[(alph.indexOf(str[i]) + n - alph.indexOf(keyWord[j])) % n];
            j++;
        }
        else {
            res += str[i];
        }
        if (j == keyWord.length)
            j = 0;
    }

    return res;
}

function getFrequencies(str) {
    let per = {};
    for (let i = 0; i < alph.length; i++) {
        per[alph[i]] = 0;
    }
    for (let i = 0; i < str.length; i++) {
        if (alph.indexOf(str[i]) != -1)
            per[str[i]]++;
    }
    return per;
}

function findKeysLetter(str) {
    let per = getFrequencies(str);
    let k = 0;
        let l;
        for (let n in per){
            if (per[n] > k){
                k = per[n];
                l = n;
            }
        }
        shift = alph.indexOf(l) - mostComm;
        return (shift>0) ? alph[shift] : alph[alph.length+shift];
}

function getIOC(str) {
    let per = getFrequencies(str);
    let iOC = 0;
    for (c in per) {
        iOC += Math.pow(per[c], 2) / Math.pow(str.length, 2);
    }
    return iOC;
}
switch (mode) {
    case 'code':
        getText(keyWord);
        break;

    case 'decode':
        let str2 = '';
        for (let i = 0; i < str.length; i++) {
            if (alph.indexOf(str[i]) != -1)
                str2 += str[i];
        }
        let shiftAlph = new Array(alph.length - 1);
        let iOC = new Array(alph.length - 1);
        let lOfKey;
        for (let i = 0; i < shiftAlph.length; i++) {
            shiftAlph[i] = '';
            for (let j = 0; j < str2.length; j += i + 1) {
                if (alph.indexOf(str2[j]) != -1)
                    shiftAlph[i] += str2[j];
            }
            iOC[i] = getIOC(shiftAlph[i]);
            if (lOfKey == undefined && iOC[i] > defIOC)
                lOfKey = i + 1;
        }
        let partsOfStr = new Array(lOfKey);
        let keyWord = '';
        for (let i= 0; i<lOfKey; i++){
            partsOfStr[i]='';
            for (let j= i; j<str2.length; j+=lOfKey){
                partsOfStr[i]+=str2[j];
            }
            keyWord += findKeysLetter(partsOfStr[i]);
        }
        console.log('Key word: ', keyWord);
        getText(keyWord);
        break;
}
fs.writeFileSync(outFile, res);