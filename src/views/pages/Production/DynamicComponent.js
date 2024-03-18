import React, { Suspense } from 'react';

const DynamicComponent = (props) => {
  return (
    <Suspense fallback={<></>}>
      {React.createElement(React.lazy(() => import(`../${props.component}`).catch((e) => {console.log(e.message)})), props)}
    </Suspense>
  );
}

export default DynamicComponent;