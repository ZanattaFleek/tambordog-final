import React from "react";


interface PropsInterface {
   oque: Array<any>;
}

export default function DevExibirJSON({ oque }: PropsInterface) {
   return (
      <>

         {oque.map(v => <div>{typeof v === 'object' ? JSON.stringify(v) : v}</div>)}

      </>
   )
}