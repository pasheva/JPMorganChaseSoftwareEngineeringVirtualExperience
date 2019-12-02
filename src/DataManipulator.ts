import { ServerRespond } from './DataStreamer';

/*
  The structure of the return object for generateRow()
*/
export interface Row {
  ratio: number,
  lower_bound: number,
  upper_bound: number,
  timestamp: Date,
  price_abc: number,
  price_def: number, 
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row { //Row Template
    //serverRespond -> Array
    //[{"id": "1", "stock": "ABC", "timestamp": "2020-06-19 02:50:19.699892", "top_bid": {"price": 126.12, "size": 279}, "top_ask": {"price": 125.84, "size": 52}},
    // { "id":"1", "stock":"DEF"...}]
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
    const ratio = priceABC/ priceDEF;
    //Cahnging the bounds in order to check the trigger alert. 
    const lowerBound = 0.2; 
    const upperBound = 1.;

    return{ //Row object
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp: serverRespond[1].timestamp,
      lower_bound: lowerBound,
      upper_bound: upperBound,
      //
      trigger_alert: (ratio>upperBound || ratio < lowerBound)? ratio:undefined
    
    };
  }
}
