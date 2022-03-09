import fs from 'fs-extra'
import i18next from 'i18next'
import User from './User'
import * as H5P from '@lumieducation/h5p-server'
import FileHandleManager from './FileHandleManager'
import fetch from 'node-fetch'

export default class FileController {
  constructor (
    private h5pEditor: H5P.H5PEditor,
    private fileHandleManager: FileHandleManager
  ) {
    console.log('asdasd')
  }

  public async open (fileHandleId: string): Promise<{
    id: string;
    library: string;
    metadata: H5P.IContentMetadata;
    parameters: any;
  }> {
    console.log('@@@@@@ OPEN!!');
    const path = this.fileHandleManager.getById(fileHandleId)?.filename
    if (!path) {
      throw new Error('File not selected before')
    }
    let buffer = null
    await fetch(path)
    .then(res => res.buffer())
    .then(bf => { 
      buffer = bf
      console.log('222 buffer-----------------------------');
      console.log(bf);
      console.log('------------------------------------');
    })
    const { metadata, parameters } = await this.h5pEditor.uploadPackage(
      buffer,
      new User()
    )
    const id = await this.h5pEditor.saveOrUpdateContent(
      undefined,
      parameters,
      metadata,
      this.getUbernameFromH5pJson(metadata),
      new User()
    )
    // console.log('5------- ', metadata)
    return {
      id,
      metadata,
      parameters,
      library: this.getUbernameFromH5pJson(metadata)
    }
  }

  private getUbernameFromH5pJson (h5pJson: H5P.IContentMetadata): string {
    const library = (h5pJson.preloadedDependencies || []).find(
      (dependency) => dependency.machineName === h5pJson.mainLibrary
    )
    if (!library) {
      return ''
    }
    return H5P.LibraryName.toUberName(library, { useWhitespace: true })
  }
}
