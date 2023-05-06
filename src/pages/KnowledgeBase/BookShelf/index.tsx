import React from "react";
import s from './index.module.less';
import BookList from "./BookList";

const BookShelf = () => {
    return (
        <div className={s.book_wrap} style={{ width:  "calc(100% - 200px)" }}>
            <BookList />
        </div>
    );
}

export default BookShelf;