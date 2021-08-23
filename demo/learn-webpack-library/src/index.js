import lod from 'lodash';
import numRef from './ref.json';

export function numToWord(num){
    return lod.reduce(numRef, (accum, ref) => {
        return ref.num === num ? ref.word : accum;
    }, '')
}

export function wordToNum(word){
    return lod.reduce(numRef, (accum, ref) => {
        return ref.word === word && word.toLowerCase() ? ref.num: accum;
    }, -1)
}