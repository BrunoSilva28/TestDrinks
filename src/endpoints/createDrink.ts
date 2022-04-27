import { Request, Response } from 'express';
import { drinkTable, studentTable } from '../constants/tableName';
import connection from '../data/connection';
import { generateId } from '../services/IdGenerator';

const createDrink = async (
    req: Request,
    res: Response
): Promise<void> => {
    let errorCode = 400;

    try {
        const author = req.headers.authorization;
        const { name, description, rating } = req.body;

        if (!author) {
            errorCode = 401;
            throw new Error("É necessário fornecer authorization");
        };

        if (!name || !description || !rating) {
            errorCode = 422;
            throw new Error("Insira um valor para name, description e rating");
        };

        if (typeof name !== "string") {
            errorCode = 422;
            throw new Error("name deve ser uma string");
        };

        if (typeof description !== "string") {
            errorCode = 422;
            throw new Error("description deve ser uma string");
        };

        if (typeof rating !== "number") {
            errorCode = 422;
            throw new Error("rating deve ser um number");
        };

        const studentExist = await connection(studentTable).select("*").where({ author });

        if (!studentExist[0]) {
            await connection(studentTable).insert({ author });
        };

        const newDrink = {
            id: generateId(),
            name,
            description,
            rating,
            author
        };

        await connection(drinkTable).insert(newDrink);

        res.status(201).send("Drink criado com sucesso!");
    } catch (error) {
        if (error instanceof Error) {
            res.status(errorCode).send(error.message);
        } else {
            res.status(500).send("Um erro ocorreu! Tente novamente");
        };
    };
};

export default createDrink;