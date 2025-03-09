import React, { useEffect, useState } from 'react'

export default function useLocation () {

  const [location, setLocation] = useState( { latitude: 0, longitude: 0 } )

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success ( pos: GeolocationPosition ) {

    const crd = pos.coords;

    setLocation( {
      latitude: crd.latitude,
      longitude: crd.longitude
    } )

    console.log( "Your current position is:" );
    console.log( `Latitude : ${crd.latitude}` );
    console.log( `Longitude: ${crd.longitude}` );
    console.log( `More or less ${crd.accuracy} meters.` );

  }

  function error ( err: any ) {
    console.warn( `ERROR(${err.code}): ${err.message}` );
  }

  useEffect( () => {
    console.log( 'Dentro do UseEffect' )
    navigator.geolocation.getCurrentPosition( success, error, options );
  }, [] )

  return location
  
  /*
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
    */

}