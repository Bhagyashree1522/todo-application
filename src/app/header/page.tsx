"use client";
import styles from '../styles/todoStyle.module.css'

export default function Header() {
    return (
        <>
            <div className="container">
                <header>
                    <div className={`row ${styles.backgroundImage}`}>
                        <h1 className="fs-1 fw-bold text-center text-white">
                            Todo App
                        </h1>
                    </div>
                </header>
            </div>
        </>
    )
}
