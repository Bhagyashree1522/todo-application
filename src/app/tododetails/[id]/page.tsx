"use client";
import Link from 'next/link'
import styles from '../../styles/todoStyle.module.css'
import { useRouter, useParams } from 'next/navigation'
import { gql, useQuery } from '@apollo/client';
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

export default function TodoDetails() {

    const router = useRouter();
    const { id } = useParams();

    const { data } = useQuery<{todo: Todo}>(GET_TODO, {
        variables: { id: id as string },
        skip: !id,
    });

    const todo = data?.todo;

    return (
        <>
            <div className="container">
                <div className='row'>
                    <div className={`border ${styles.modalContent}`}>
                        <div className="modal-header my-2 justify-center">
                            <h1 className="modal-title fs-5">Task Details</h1>
                        </div>
                        <div className="modal-body">
                            <form action="" className="row g-3">
                                <div className="col-md-12">
                                    <label className="fw-bold mb-2">Title</label>
                                    <p>{todo?.title}</p>
                                </div>
                                <div className="col-md-6">
                                    <label className="fw-bold mb-2">Deadline</label>
                                    <p>{todo?.deadline}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold mb-2">Comments</label>
                                    <p>{todo?.comments}</p>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer my-3">
                            <Link href='/'>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
