import React from 'react'

declare const ModalBlank: React.FC<{
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  id: string
  children: React.ReactNode
}>;

export default ModalBlank
