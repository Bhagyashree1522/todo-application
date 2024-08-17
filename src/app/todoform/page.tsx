"use client";
import styles from '../styles/todoStyle.module.css'
import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Todo } from '../../../Todo-nest-server/dist/todo/interfaces/todo.interface';


const CREATE_TODO = gql`
    mutation createTodo($createTodoInput: CreateTodoInput!) {
        createTodo(createTodoInput: $createTodoInput) {
                id
                title
                deadline
                comments
            }
        }
    `;


export default function TodoForm() {

    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [comments, setComments] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    
    const [createTodo] = useMutation<{todo: Todo}>(CREATE_TODO);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await createTodo({ 
                variables: {
                    createTodoInput: {
                        title, 
                        deadline, 
                        comments
                    }
                }
            });
            router.push('/');
            console.log('New todo created:', data);
        }catch (error) {
            console.log('Error creating todo:', error);
        }
    };

    const handleClose = () => {
        router.push('/');
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="container">
                <div className='row'>
                    <div className={`border ${styles.modalContent}`}>
                        <div className="modal-header justify-content-center my-2">
                            <h1 className="modal-title fs-5">Task Form</h1>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleCreateTodo}>
                                <div className="col-md-12">
                                    <label htmlFor="inputTitle" className="form-label">Title</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="inputTitle" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="inputDeadline" className="form-label">Deadline</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        id="inputDeadline" 
                                        value={deadline} 
                                        onChange={(e) => setDeadline(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="textareaComments" className="form-label">Comments</label>
                                    <textarea 
                                        className="form-control" 
                                        id="textareaComments" 
                                        rows={3} 
                                        value={comments} 
                                        onChange={(e) => setComments(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className='d-flex my-3'>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                                    <button type="submit" className="btn btn-primary ml-2">Add Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}