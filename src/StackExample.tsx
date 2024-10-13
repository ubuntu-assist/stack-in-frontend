import { useReducer } from 'react'

interface Row {
  id: string
  name: string
}

interface ActionRemove {
  type: 'remove'
  id: string
  index: number
}

interface ActionUndo {
  type: 'undo'
}

type Action = ActionRemove | ActionUndo

interface HistoryEntry {
  action: ActionRemove
  row: Row
}

interface State {
  rows: Row[]
  history: HistoryEntry[]
}

const rows: Row[] = [
  { id: 'id-1', name: 'Row 1' },
  { id: 'id-2', name: 'Row 2' },
  { id: 'id-3', name: 'Row 3' },
  { id: 'id-4', name: 'Row 4' },
  { id: 'id-5', name: 'Row 5' },
  { id: 'id-6', name: 'Row 6' },
]

// Function to remove a row
function removeRow(state: State, action: ActionRemove): Row[] {
  return state.rows.filter(({ id }) => id !== action.id)
}

// Function to add a row at the original index
function addRowAtOriginalIndex(state: State): Row[] {
  const undo = state.history[state.history.length - 1]
  return [
    ...state.rows.slice(0, undo.action.index),
    undo.row,
    ...state.rows.slice(undo.action.index),
  ]
}

// Initial state
const initialState: State = { rows, history: [] }

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'remove':
      return {
        rows: removeRow(state, action),
        history: state.history.concat({
          action,
          row: state.rows[action.index],
        }),
      }
    case 'undo':
      return {
        rows: addRowAtOriginalIndex(state),
        history: state.history.slice(0, -1),
      }
    default:
      throw new Error('Unhandled action type')
  }
}

// Component that uses the reducer
function TableUsingStack() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className='table-container'>
      <div className='content'>
        <h1 className='title'>
          Real World Application of Stack in Frontend Development
        </h1>
        <button
          className='undo-button'
          onClick={() => dispatch({ type: 'undo' })}
          disabled={state.history.length === 0}
        >
          Undo Last Action
        </button>

        <table className='fancy-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {state.rows.map(({ id, name }, index) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>
                  <button
                    className='delete-button'
                    onClick={() => dispatch({ type: 'remove', id, index })}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableUsingStack
