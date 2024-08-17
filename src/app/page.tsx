"use client";
import styles from '../app/styles/todoStyle.module.css'
import Link from 'next/link'
import { useQuery, gql, useMutation } from '@apollo/client';
import { Todo } from '../../Todo-nest-server/dist/todo/interfaces/todo.interface';


interface GetTodosQuery {
    todos: Todo[];
}

interface DeleteTodoMutation {
    deleteTodo: {
        id: string;
    };
}

const GET_TODOS = gql `
        query {
            todos {
                id
                title
                deadline
                comments
            }
        }
    `;

const DELETE_TODO = gql`
    mutation deleteTodo($id: String!) {
            deleteTodo(id: $id) {
                id
                title
                deadline
                comments
            }
        }
    `;

export default function TodoHomePage() {

    const { data} = useQuery<GetTodosQuery>(GET_TODOS);
    
    const [deleteTodo] = useMutation<DeleteTodoMutation>(DELETE_TODO, {
        update(cache, { data: mutationData }) {
            if (!mutationData) return;
            const { deleteTodo } = mutationData;
            const existingTodos = cache.readQuery<GetTodosQuery>({ query: GET_TODOS });
            if (existingTodos?.todos) {
                const newTodos = existingTodos.todos.filter(todo => todo.id !== deleteTodo.id);
                cache.writeQuery({
                    query: GET_TODOS,
                    data: { todos: newTodos },
                });
            }
        }
    });

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className={`border ${styles.todoList}`}>
                        <div className='d-flex justify-content-between my-3'>
                            <h2 className='fs-3 fw-bold'>Todo List</h2>
                            <Link href={`/todoform`}>
                                <button className='btn btn-primary'>
                                    <i className="bi bi-plus"></i>Add Task
                                </button>
                            </Link>
                        </div>
                        {
                            data?.todos.map((todo) => (
                                <div className={`col-md-12 ${styles.todoTask}`} key={todo.id}>
                                    <div className="d-flex justify-content-around fs-6">
                                        <Link href={`/tododetails/${todo.id}`} className='w-50 text-decoration-none text-dark'>
                                            <p className='text-truncate'>{todo.title}</p>
                                        </Link>
                                        <p className='w-25  text-truncate'>{todo.deadline}</p>
                                        <Link href={`/todoupdate/${todo.id}`}>
                                            <button className="btn fs-5 text-info">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                        </Link>
                                        <button className="btn fs-5 text-danger" onClick={() => deleteTodo({ variables: { id: todo.id} })}><i className="bi bi-trash"></i></button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
