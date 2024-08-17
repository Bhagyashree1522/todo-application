"use client";
import styles from '../../styles/todoStyle.module.css'
import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Todo } from '../../../../Todo-nest-server/dist/todo/interfaces/todo.interface';


const GET_TODO = gql `
    query findById($id: String!) {
        todo(id: $id) {
            id
            title
            deadline
            comments
            }
        }
    `;

const UPDATE_TODO = gql`
    mutation updateTodo($updateTodoInput: UpdateTodoInput!) {
        updateTodo(updateTodoInput: $updateTodoInput) {
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
    const { id } = useParams();
    
    const { data } = useQuery<{todo: Todo}>(GET_TODO, { 
        variables: { id },
         skip: !id 
    });
    const [updateTodo] = useMutation<{ updateTodo: Todo }>(UPDATE_TODO);

    useEffect(() => {
        if (data?.todo) {
            setTitle(data.todo.title);
            setDeadline(data.todo.deadline);
            setComments(data.todo.comments);
            setIsLoading(false);
        } else if (!id) {
            setIsLoading(false);
        }
    }, [data, id]);

    const handleUpdateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const { data } = await updateTodo({ 
                variables: { 
                    updateTodoInput: {
                        id,
                        title,
                        deadline,
                        comments,
                    },
                },
            });
            router.push('/');
            console.log('Todo Updated:', data);
        }catch (error) {
            console.error('Error updating todo:', error);
        }
    }

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
                            <h1 className="modal-title fs-5">Task Update</h1>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdateTodo}>
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
                                    <button type="submit" className="btn btn-primary ml-2">Update Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}