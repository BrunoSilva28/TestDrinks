import { Request, Response } from 'express';
import { drinkTable } from '../constants/tableName';
import connection from '../data/connection';

const deleteDrink = async (
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
            .select("*")
            .where({id: drinkId})
            .andWhere({ author });

        if (!drinkById[0]) {
            errorCode = 422;
            throw new Error("Drink não encontrado! Tente um novo id");
        };

        await connection(drinkTable)
            .delete()
            .where({ id: drinkId})
            .andWhere({ author });

        res.status(200).send("Drink removido com sucesso!");
    } catch (error) {
        if (error instanceof Error) {
            res.status(errorCode).send(error.message);
        } else {
            res.status(500).send("Um erro ocorreu! Tente novamente");
        };
    };
};

export default deleteDrink;