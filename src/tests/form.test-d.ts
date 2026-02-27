/// <reference path="../utils.d.ts" />
/// <reference path="../entrypoints/form.d.ts" />
import { expectTypeOf } from 'vitest'

// TypedFormData
type LoginForm = { username: string; password: string; avatar: File }
const fd = new FormData() as Awake.TypedFormData<LoginForm>

expectTypeOf(fd.get('username')).toEqualTypeOf<string | null>()
expectTypeOf(fd.get('avatar')).toEqualTypeOf<File | null>()

// TypedURLSearchParams
type SearchParams = { page: string; limit: string; q: string }
const params = new URLSearchParams() as Awake.TypedURLSearchParams<SearchParams>

expectTypeOf(params.get('page')).toEqualTypeOf<string | null>()
