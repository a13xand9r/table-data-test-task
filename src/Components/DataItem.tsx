import { FC, useState } from 'react'
import { DataType } from './App'
import './DataItem.css'
import { Form } from './Form'
import { Draggable } from 'react-beautiful-dnd'
import handleIcon from '../Assets/Img/dragHandleIcon.png'

export const DataItem: FC<PropsType> = ({ el, onChange, deleteData, index }) => {
    const [isEditMode, setIsEditMode] = useState(false)
    const onSubmitHandler = (name: string, type: string, color: string) => {
        setIsEditMode(false)
        onChange(el.id, name, type, color)
    }
    let timerId: number
    const onBlurHandler = () => {
        timerId = setTimeout(() => setIsEditMode(false))
    }
    const onFocusHandler = () => clearTimeout(timerId)
    const deleteItem = () => deleteData(el.id)
    return (
    <Draggable draggableId={el.id} index={index}>
        {provided => (
        <div className='item-container'
            ref={provided.innerRef}
            {...provided.draggableProps}>
        <img {...provided.dragHandleProps} src={handleIcon} alt='' className='handlerIcon'/>
        {isEditMode ?
            <Form formType='CHANGE'
                name={el.name}
                type={el.type}
                color={el.color}
                formSubmit={onSubmitHandler}
                editModeBlurHandler={onBlurHandler}
                editModeFocusHandler={onFocusHandler}
            /> :
            <div onClick={() => setIsEditMode(true)} className='data__item item'>
                <div className='item__color' style={{ backgroundColor: el.color }}></div>
                <div className='item__name'>{el.name}</div>
                <span onClick={deleteItem} className='item__delete'></span>
            </div>
        }
        </div>
        )}
        </Draggable>
    )
}

type PropsType = {
    el: DataType
    index: number
    onChange: (id: string, name: string, type: string, color: string) => void
    deleteData: (id: string) => void
}