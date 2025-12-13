/**
 * Loader to fetch words data from the API.
 *
 * @author Sean MacDougall
 */

import type {Word} from '@/types'

import {api} from '@/api'

export const wordsLoader = async () => {
  const {data} = await api.get<{words: Word[]}>('/words')
  return {words: data.words}
}
