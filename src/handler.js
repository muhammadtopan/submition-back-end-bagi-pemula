const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const { name, year, autor, summary, publisher, pageCount, readPage,reading } = request.payload;

    const id = nanoid(16);
    let finished = false;
    if (pageCount === readPage) {
        finished = true
    }
    else{
        finished= false
    }
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (name === undefined || name === '') {
        const response = h.response({
            status: 'fail',
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const newBook = {
        id, name, year, autor, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBookHandler = (request, h) => {

    const { name, reading, finished} = request.query;

    if (name !== undefined) {
        return {
            status: 'success',
            data: {
                books: books
                    .filter(book => book.name.toLowerCase().includes(name.toLowerCase()))
                    .map((b) => ({
                        "id" : b.id,
                        "name" : b.name,
                        "publisher" : b.publisher,
                    }))
            }
        }
    }

    if (reading !== undefined) {
        if (reading === 1) {
            return {
                status: 'success',
                data: {
                    books: books
                        .filter(book => book.reading === true)
                        .map((b) => ({
                            "id" : b.id,
                            "name" : b.name,
                            "publisher" : b.publisher,
                        }))
                }
            }
        } else {
            return {
                status: 'success',
                data: {
                    books: books
                    .filter(book => book.reading === false)
                    .map(b => ({
                        id: b.id,
                        name: b.name,
                        publisher: b.publisher
                    }))
                }
            }
        }
    }

    if (finished !== undefined) {
        if (finished === '1') {
            return {
                status: 'success',
                data: {
                books: books
                        .filter(book => book.finished === true)
                        .map(b => ({
                        id: b.id,
                        name: b.name,
                        publisher: b.publisher
                    }))
                }
            }
        } else if(finished === '0') {
            return {
                status: 'success',
                data: {
                    books: books
                    .filter(book => book.finished === false)
                    .map(b => ({
                        id: b.id,
                        name: b.name,
                        publisher: b.publisher
                    }))
                }
            }
        }
    }

    const response = h.response({
        status: 'success',
        data: {
            books : books.map((book) => ({
                "id" : book.id,
                "name" : book.name,
                "publisher" : book.publisher,
            }))
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId )[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, autor, summary, publisher, pageCount, readPage,reading } = request.payload;
    let finished = true;
    if (pageCount === readPage) {
        finished = true
    } else {
        finished = false;
    }
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        if (name === undefined || name === '') {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
        }
        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
        }
        books[index] = {
        ...books[index],
        name, 
        year, 
        autor, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        reading,
        updatedAt,
        };

        const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui Buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { 
    addBookHandler, 
    getAllBookHandler, 
    getBookByIdHandler, 
    editBookByIdHandler,
    deleteBookByIdHandler,
};