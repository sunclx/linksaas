import React from "react";
import { observer } from 'mobx-react';
import s from './index.module.less';
import { useStores } from "@/hooks";
import { PAGE_TYPE } from '@/stores/bookShelf';
import BookList from "./BookList";


const BookShelf = () =>{
    const bookShelfStore = useStores('bookShelfStore');

    return (
        <div className={s.book_wrap}>
            {bookShelfStore.pageType == PAGE_TYPE.PAGE_BOOK_LIST && <BookList/>}
        </div>
    );
}

export default observer(BookShelf);