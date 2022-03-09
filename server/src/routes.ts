import express from 'express';
import * as H5P from '@lumieducation/h5p-server';
import FileHandleManager from './services/FileHandleManager'
import FileController from './services/service'
import {
    IRequestWithUser,
    IRequestWithLanguage
} from '@lumieducation/h5p-express';

import User from './User';

/**
 * @param h5pEditor
 * @param h5pPlayer
 * @param languageOverride the language to use. Set it to 'auto' to use the
 * language set by a language detector in the req.language property.
 * (recommended)
 */
export default function (
    h5pEditor: H5P.H5PEditor,
    h5pPlayer: H5P.H5PPlayer,
    languageOverride: string | 'auto' = 'auto'
): express.Router {
    const router = express.Router();

    router.get(`/:contentId/play`, async (req, res) => {
        try {
            const content = await h5pPlayer.render(
                req.params.contentId,
                new User(),
                languageOverride === 'auto'
                    ? req.language ?? 'en'
                    : languageOverride
            );
            res.send(content);
            console.log('play');
            res.status(200).end();
        } catch (error) {
            res.status(500).end(error.message);
        }
    });

    router.get('/:contentId/edit', async (req: IRequestWithLanguage, res) => {
        // This route merges the render and the /ajax/params routes to avoid a
        // second request.
        console.log('edit ---------   ', req.params);
        const editorModel = (await h5pEditor.render(
            req.params.contentId === 'undefined'
                ? undefined
                : req.params.contentId,
            languageOverride === 'auto'
                ? req.language ?? 'en'
                : languageOverride,
            new User()
        )) as any;
        if (!req.params.contentId || req.params.contentId === 'undefined') {
            res.send(editorModel);
        } else {
            const content = await h5pEditor.getContent(req.params.contentId);
            console.log('edit --------  content  -----', content);
            res.send({
                ...editorModel,
                library: content.library,
                metadata: content.params.metadata,
                params: content.params.params
            });
        }
        res.status(200).end();
    });

    router.post('/openfile', async (req: IRequestWithLanguage, res) => {
        console.log('1---------   ', req.body);
        const file = req.body.file
        console.log('@@@@@@ -----   file ----   ',file)
        const fileHandleManager = new FileHandleManager()
        const fileHandle = fileHandleManager.create(file)
        const fileController = new FileController(h5pEditor, fileHandleManager)
        const result = fileController.open(fileHandle.handleId)
        console.log('4---------   ', result);
        const { id, metadata, parameters, library } = await result
        console.log('1----------------content id -----', id);
        const editorModel = (await h5pEditor.render(
                id === 'undefined'
                ? undefined
                : id,
                'en',
                new User()
            )) as H5P.IEditorModel;
        if (!id || id === 'undefined') {
            res.send(editorModel);
        } else {
            const content = await h5pEditor.getContent(id);
            console.log('content id -----', id);
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            console.log('content  -----', content);
            res.send({
                model:{
                ...editorModel,
                library: content.library,
                metadata: content.params.metadata,
                params: content.params.params
                },
                contentId: id
            });         
        }        
        res.status(200).end();
    });

    router.post('/playfile', async (req: IRequestWithLanguage, res) => {
        const file = req.body.file
        const fileHandleManager = new FileHandleManager()
        const fileHandle = fileHandleManager.create(file)
        const fileController = new FileController(h5pEditor, fileHandleManager)
        const result = fileController.open(fileHandle.handleId)
        const { id, metadata, parameters, library } = await result
        console.log('@@@@ player ---- id ', id)
        try {
            const content = await h5pPlayer.render(
                id,
                new User(),
                'en'
            );
            console.log('11111111 content-----------------------------');
            console.log(content);
            console.log('------------------------------------------');
            res.send({
                model:content,
                contentId: id
            });
            console.log('play');
            res.status(200).end();            
        } catch (error) {
            res.status(500).end(error.message);
        }
        res.status(200).end();
    });

    router.post('/', async (req: IRequestWithUser, res) => {
        if (
            !req.body.params ||
            !req.body.params.params ||
            !req.body.params.metadata ||
            !req.body.library ||
            !req.user
        ) {
            res.status(400).send('Malformed request').end();
            return;
        }
        const { id: contentId, metadata } =
            await h5pEditor.saveOrUpdateContentReturnMetaData(
                undefined,
                req.body.params.params,
                req.body.params.metadata,
                req.body.library,
                req.user
            );

        res.send(JSON.stringify({ contentId, metadata }));
        res.status(200).end();
    });

    router.patch('/:contentId', async (req: IRequestWithUser, res) => {
        if (
            !req.body.params ||
            !req.body.params.params ||
            !req.body.params.metadata ||
            !req.body.library ||
            !req.user
        ) {
            res.status(400).send('Malformed request').end();
            return;
        }
        const { id: contentId, metadata } =
            await h5pEditor.saveOrUpdateContentReturnMetaData(
                req.params.contentId.toString(),
                req.body.params.params,
                req.body.params.metadata,
                req.body.library,
                req.user
            );

        res.send(JSON.stringify({ contentId, metadata }));
        res.status(200).end();
    });

    router.delete('/:contentId', async (req: IRequestWithUser, res) => {
        try {
            await h5pEditor.deleteContent(req.params.contentId, req.user);
        } catch (error) {
            res.send(
                `Error deleting content with id ${req.params.contentId}: ${error.message}`
            );
            res.status(500).end();
            return;
        }

        res.send(`Content ${req.params.contentId} successfully deleted.`);
        res.status(200).end();
    });

    router.get('/', async (req: IRequestWithUser, res) => {
        // TODO: check access permissions

        const contentIds = await h5pEditor.contentManager.listContent();
        const contentObjects = await Promise.all(
            contentIds.map(async (id) => ({
                content: await h5pEditor.contentManager.getContentMetadata(
                    id,
                    req.user
                ),
                id
            }))
        );

        res.status(200).send(
            contentObjects.map((o) => ({
                contentId: o.id,
                title: o.content.title,
                mainLibrary: o.content.mainLibrary
            }))
        );
    });

    return router;
}
