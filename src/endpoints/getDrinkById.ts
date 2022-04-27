import { Request, Response } from 'express';
import { drinkTable } from '../constants/tableName';
import connection from '../data/connection';

const getDrinkById = async(
    req: Request,
    res: Response
): Promise<void> => {
    let errorCode = 400;

    try {
        const author = req.headers.authorization;
        const drinkId = req.params.id;

        if (!author) {
            errorCode = 401;
            throw new Error("É necessário fornecer authorization");
        };

        if(!drinkId) {
            errorCode = 422;
            throw new Error("É necessário fornecer o id");
        };

        const drinkById = await connection(drinkTable)
            .select("id", "name", "description", "rating")
            .where({id: drinkId})
            .andWhere({ author });

        res.status(200).send({ result: drinkById[0]});
    } catch(error) {
        if (error instanceof Error) {
            res.status(errorCode).send(error.message);
        } else {
            res.status(500).send("Ops, um erro ocorreu! Tente novamente");
        };
    };
};

export default getDrinkById;