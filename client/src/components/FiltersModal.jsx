import { useState } from 'react'
import { Button, Modal } from 'flowbite-react'

const FiltersModal = ({ isOpen, onClose, types, distillers, selectedType, selectedDistiller, onTypeChange, onDistillerChange }) => {
  return (
    <Modal className='modal' dismissible show={isOpen} onClose={onClose}>
      <Modal.Header>Choose Your Filters</Modal.Header>
      <Modal.Body>
        <div className="modal-content flex flex-wrap gap-6 justify-around sm:text-md text-sm">
          {/* Filter options for types */}
          <div className='flex flex-col'>
            <label className='font-semibold'>Type:</label>
            <div className="grid grid-cols-2 gap-2">
              {types.map((option) => (
                <div key={option.value}>
                  <input
                    type="checkbox"
                    id={option.value}
                    value={option.value}
                    checked={option.value === selectedType}
                    onChange={onTypeChange}
                  />
                  <label htmlFor={option.value} className='ml-1'>{option.label}</label>
                </div>
              ))}
            </div>
          </div>
          {/* Filter options for distillers */}
          <div className='flex flex-col'>
            <label className='font-semibold'>Distiller:</label>
            <div className="grid grid-cols-2 gap-2">
              {distillers.map((option) => (
                <div key={option.value}>
                  <input
                    type="checkbox"
                    id={option.value}
                    value={option.value}
                    checked={option.value === selectedDistiller}
                    onChange={onDistillerChange}
                  />
                  <label htmlFor={option.value} className='ml-1'>{option.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className='justify-end'>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FiltersModal
