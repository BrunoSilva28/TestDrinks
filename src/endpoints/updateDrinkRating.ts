import { Request, Response } from 'express';
import { drinkTable } from '../constants/tableName';
import connection from '../data/connection';

const updateDrinkRating = async (
    req: Request,
    res: Response
): Promise<void> => {
    let errorCode = 400;

    try {
        const author = req.headers.authorization;
        const drinkId = req.params.id;
        const rating = Number(req.body.rating);

        if (!author) {
            errorCode = 401;
            throw new Error("É necessário fornecer authorization");
        };

        if(!drinkId) {
            errorCode = 422;
            throw new Error("É necessário fornecer o id");
        };

        if(!rating) {
            errorCode = 422;
            throw new Error("É necessário fornecer o novo rating como um número");
        };

        if(rating < 0 || rating > 10) {
            errorCode = 422;
            throw new Error("Novo 'rating' precisa ser um número entre 0 e 10");
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
            .update({rating})
            .where({id: drinkId})
            .andWhere({ author });

        res.status(200).send("Nota do Drink atualizado com sucesso!");
    } catch (error) {
        if (error instanceof Error) {
            res.status(errorCode).send(error.message);
        } else {
            res.status(500).send("Um erro ocorreu! Tente novamente");
        };
    };
};

export default updateDrinkRating;