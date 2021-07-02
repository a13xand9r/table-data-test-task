import { FC, FormEvent, MutableRefObject, useEffect, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import './Form.css'

export const Form: FC<PropsType> = (props) => {
    const { formType, formSubmit, editModeBlurHandler, editModeFocusHandler } = { ...props }
    const [name, setName] = useState(props.name)
    const [type, setType] = useState(props.type)
    const [color, setColor] = useState(props.color)
    const [showColorPicker, setShowColorPicker] = useState(false)
    let timeoutId: any
    const onBlurHandler = () => {
        timeoutId = setTimeout(() => setShowColorPicker(false))
    }
    const onFocusHandler = () => {
        clearTimeout(timeoutId)
        setShowColorPicker(true)
    }
    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        formSubmit(name, type, color)
        setName('')
        setType('')
    }
    const formRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        !!formRef.current && formRef.current.focus()
    }, [])
    return <form onBlur={editModeBlurHandler}
        onFocus={editModeFocusHandler}
        className='app__new-data new'
        style={{marginTop: `${formType === 'NEW' ? '15px' : '0'}`}}
        onSubmit={onSubmitHandler}
        >
        {formType === 'CHANGE' && <div style={{ backgroundColor: color }}
            className='new__color'
            tabIndex={1}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            >
            {showColorPicker &&
                <SketchPicker className='new__color-picker'
                    color={color}
                    onChangeComplete={color => setColor(color.hex)} />}
        </div>}
        <input placeholder='Введите название'
            id='name' type="text"
            ref={formRef}
            className='new__name'
            autoComplete='off'
            value={name}
            onChange={e => setName(e.target.value)}
            required />
        <select className='new__type' value={type} onChange={e => setType(e.target.value)} required>
            {formType === 'NEW' && <option value="" selected disabled hidden>Выберите тип</option>}
            <option>main</option>
            <option>side</option>
        </select>
        {formType === 'NEW' && <div style={{ backgroundColor: color }}
            className='new__color'
            tabIndex={0}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler} >
            {showColorPicker &&
                <SketchPicker className='new__color-picker'
                    color={color}
                    onChangeComplete={color => setColor(color.hex)} />}
        </div>}
        <input type="submit" value={formType === 'NEW' ? 'Добавить' : 'Изменить'} className='new__button' />
    </form>
}

type PropsType = {
    formType: 'NEW' | 'CHANGE'
    name: string
    type: string
    color: string
    ref?: MutableRefObject<null>
    editModeBlurHandler?: () => void
    editModeFocusHandler?: () => void
    formSubmit: (name: string, type: string, color: string) => void
}