import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'

const prisma = new PrismaClient()

await prisma.user.deleteMany()

const kody = await prisma.user.create({
	data: {
		email: 'kody@kcd.dev',
		username: 'kody',
		name: 'Kody',
	},
})

// 🐨 Move this to be nested in the note create
const newImage1 = await prisma.image.create({
	data: {
		altText: 'an adorable koala cartoon illustration',
		file: {
			create: {
				contentType: 'image/png',
				blob: await fs.promises.readFile(
					'./tests/fixtures/images/kody-notes/cute-koala.png',
				),
			},
		},
	},
})

// 🐨 Move this to be nested in the note create
const newImage2 = await prisma.image.create({
	data: {
		altText: 'a cartoon illustration of a koala in a tree eating',
		file: {
			create: {
				contentType: 'image/png',
				blob: await fs.promises.readFile(
					'./tests/fixtures/images/kody-notes/koala-eating.png',
				),
			},
		},
	},
})

// 🐨 move this to be nested in the user create
const firstNote = await prisma.note.create({
	data: {
		id: 'd27a197e',
		title: 'Basic Koala Facts',
		content:
			'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
		ownerId: kody.id,
	},
})

// 🐨 move this to be nested in the note create
await prisma.note.update({
	where: { id: firstNote.id },
	data: {
		images: {
			// 🐨 swap this for a "create" instead of a "connect" and inline the
			// newImage1 and newImage2 data
			connect: [{ id: newImage1.id }, { id: newImage2.id }],
		},
	},
})
