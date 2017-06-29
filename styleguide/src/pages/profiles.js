const head = require('../templates/head')
const header = require('../templates/header')
const timeline = require('../templates/timeline')
const footer = require('../templates/footer')

const skills = require('../templates/objects/o-skill-tags')

const profile = require('../templates/components/c-profile')

module.exports = `
	${head}
	${header({currentPage: 'profiles'})}
	<div class="wrap">
		<section class="profiles__search">
			<div class="timeline__search">
				<input class="timeline__search__input" type="search" placeholder="Search by name">
			</div>
		</section>
		<section class="tags-cloud">
			${skills(
				['Javascript', 'React', 'Angular', 'CSS']
			)}
		</section>
		<section class="profiles__profile">
			${profile}
		</section>
	${footer}
`