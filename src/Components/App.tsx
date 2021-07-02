import { useCallback, useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import './App.css'
import { DataItem } from './DataItem'
import { Form } from './Form'

function App() {
  const [data, setData] = useState<DataType[]>([])
  const addData = (name: string, type: string, color: string) => {
    setData(prev => [...prev, { name, type, color, id: Date.now().toString() }])
  }
  const deleteData = (id: string) => {
    setData(prev => prev.filter((el) => el.id !== id))
  }
  const changeData = (id: string, name: string, type: string, color: string) => {
    setData(prev => (prev.map((el) => {
      if (id === el.id) return { id, name, type, color }
      else return el
    })))
  }
  const onDragEnd = useCallback(
    (result: DropResult) => {
        const { destination, reason, source } = result
        if (!destination || destination.index === source.index || reason === 'CANCEL') {
            return
        }
        setData(prev => {
          const list = [...prev]
          const droppedPoint = { ...prev[source.index] }
          list.splice(source.index, 1)
          list.splice(destination.index, 0, droppedPoint)
          return list
        })
    }, [])
  useEffect(() => {
    if (!!data.length)
      localStorage.setItem('data', JSON.stringify(data))
  }, [data])
  useEffect(() => {
    if (localStorage.getItem('data'))
      setData(JSON.parse(localStorage.getItem('data') as string))
  }, [])
  return (
    <div className='app'>
      <Form formType='NEW' name='' type='' color='#50E3C2' formSubmit={addData} />
      <ul className='app__data data'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='list'>
          {provided =>
          (<li ref={provided.innerRef} {...provided.droppableProps}>
            {data.map((el, i) => (
              <DataItem
                key={el.id}
                el={el}
                onChange={changeData}
                deleteData={deleteData}
                index={i}
              />
            ))}
            {provided.placeholder}
          </li>)}
        </Droppable>
      </DragDropContext>
      </ul>
    </div>
  );
}

export default App;

export type DataType = {
  name: string
  type: string
  color: string
  id: string
}