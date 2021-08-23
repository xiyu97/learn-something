import {
    add,
    multiply,
  } from "./deps.js";

  function totalCost(outbound, inbound, tax) {
    return multiply(add(outbound, inbound), tax);
  }
  
  console.log(totalCost(19, 31, 1.2));
  console.log(totalCost(45, 27, 1.15));