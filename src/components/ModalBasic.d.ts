import React from 'react'

declare const ModalBasic: React.FC<{
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  id: string
  title: string
  children: React.ReactNode
}>;

export default ModalBasic
