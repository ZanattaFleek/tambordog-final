import React, { useEffect, useState } from 'react'

export default function useWindowDimensions () {

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const [windowDimensions, setWindowDimensions] = useState( getWindowDimensions() );

  useEffect( () => {
    function handleResize () {
      setWindowDimensions( getWindowDimensions() );
    }

    window.addEventListener( 'resize', handleResize );
    return () => window.removeEventListener( 'resize', handleResize );
  }, [] );

  return windowDimensions;

}