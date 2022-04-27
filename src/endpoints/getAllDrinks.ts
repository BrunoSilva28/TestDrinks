import { Request, Response } from 'express';
import { drinkTable } from '../constants/tableName';
import connection from '../data/connection';

const getAllDrinks = async(
    req: Request,
    res: Response
): Promise<void> => {
    let errorCode = 400;

    try {
        const author = req.headers.authorization;

        if (!author) {
            errorCode = 401;
            throw new Error("É necessário fornecer authorization");
        };

        const allDrinksByStudent = await connection(drinkTable)
            .select("id", "name", "description", "rating")
            .where({ author });

        res.status(200).send({ result: allDrinksByStudent });
    } catch(error) {
        if (error instanceof Error) {
            res.status(errorCode).send(error.message);
        } else {
            res.status(500).send("Ops, um erro ocorreu! Tente novamente");
        };
    };
};

export default getAllDrinks;