import _ from 'lodash';
import './style.css';
import archive from './img/archive.jpg';
import Data from './data.xml';

function component() {
    const element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    element.classList.add('hello');

    // 将图像添加到我们已经存在的 div 中。
    const myIcon = new Image();
    myIcon.src = archive;
    element.appendChild(myIcon);

    console.log(Data)

    return element;
}

document.body.appendChild(component());


// location ^~ /h5/ {
//     try_files $url $url/ /h5/index.html?$args;
//     index index.html;
// }