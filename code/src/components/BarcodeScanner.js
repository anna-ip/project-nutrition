import React, { useRef, useState, useLayoutEffect } from 'react'
import Quagga from 'quagga'
import styled from 'styled-components/macro'
import { LoadingIndicator } from 'components/LoadingIndicator'

const Section = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin: 15px;
`
const Camera = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  bottom: 408px;
  right: 0px;
  width: 300px;
  height: 200px;
`


export const BarcodeScanner = ({ className, onDetected }) => {
  const [initializing, setInitializing] = useState(true)
  const cameraDivRef = useRef()
  const hasResult = useRef(false)

  Quagga.onDetected((data) => {
    if (!hasResult.current) {
      onDetected(data.codeResult.code)
    }
    hasResult.current = true

    setTimeout(() => {
      hasResult.current = false
    }, 500)
  })

  useLayoutEffect(() => {
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: cameraDivRef.current
      },
      decoder: {
        readers: ['ean_reader']
      }
    }, (err) => {
      if (err) {
        console.error('Failed to initialize reader', err)
        return
      }
      Quagga.start()
      setInitializing(false)
    })

    return () => {
      Quagga.stop()
    }
  }, [])

  return (
    <Section>
      {initializing && <LoadingIndicator />}
      <Camera ref={cameraDivRef} className={className} > </Camera>
    </Section>
  )
}
