import React from 'react';
import BottomSheetComponent from './BottomSheetComponent';

const MainComponent = ({ route }: { route: any }) => {
    
    const { user } = route.params;
  return (
    <BottomSheetComponent user={user}/>
  );
};

export default MainComponent;
