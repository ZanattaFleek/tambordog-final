import React from 'react'
import { Dialog } from '@mui/material'

interface ModalComponentInterface {
  exibir: boolean
  setExibir: React.Dispatch<React.SetStateAction<any>>
  children: any
}

export default function ModalComponent ( { exibir, setExibir, children }: ModalComponentInterface ) {

  return (
    <>
      <Dialog
        fullWidth
        open={exibir}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>{children}</>
      </Dialog>
    </>
  )

}