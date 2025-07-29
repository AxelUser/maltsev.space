<script lang="ts">
	import { SvelteIcon, ReactIcon, KotlinIcon, CSharpIcon } from './icons';
</script>

<div class="planet-container">
	<div class="planet">
		<div class="planet-shadow"></div>
	</div>
	<div class="tech-orbit orbit-1">
		<div class="tech-moon position-top">
			<div class="tech-icon">
				<CSharpIcon size="24px" />
			</div>
		</div>
	</div>
	<div class="tech-orbit orbit-2">
		<div class="tech-moon position-right">
			<div class="tech-icon">
				<KotlinIcon size="24px" />
			</div>
		</div>
	</div>
	<div class="tech-orbit orbit-3">
		<div class="tech-moon position-bottom">
			<div class="tech-icon">
				<ReactIcon size="24px" />
			</div>
		</div>
	</div>
	<div class="tech-orbit orbit-4">
		<div class="tech-moon position-left">
			<div class="tech-icon">
				<SvelteIcon size="24px" />
			</div>
		</div>
	</div>
</div>

<style>
	@import 'open-props/media';
	.planet-container {
		position: relative;
		width: 540px;
		height: 540px;
		margin: var(--gap) 0;
		overflow: hidden;
	}

	.planet {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: radial-gradient(circle at 30% 30%, var(--planet), var(--brand));
		box-shadow: 0 0 20px rgba(76, 170, 255, 0.4);
	}

	.planet-shadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: linear-gradient(45deg, rgba(0, 0, 0, 0.5), transparent 70%);
	}

	.tech-orbit {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--text-2) 30%, transparent);
	}

	.orbit-1 {
		width: 160px;
		height: 160px;
		animation: orbit-rotation 25s linear infinite;
	}

	.orbit-2 {
		width: 260px;
		height: 260px;
		animation: orbit-rotation 30s linear infinite;
	}

	.orbit-3 {
		width: 360px;
		height: 360px;
		animation: orbit-rotation 35s linear infinite;
	}

	.orbit-4 {
		width: 460px;
		height: 460px;
		animation: orbit-rotation 40s linear infinite;
	}

	.tech-moon {
		position: absolute;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: var(--text-2);
		box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
		display: flex;
		justify-content: center;
		align-items: center;
		animation: counter-orbit-rotation 25s linear infinite;
	}

	.orbit-1 .tech-moon {
		animation-duration: 25s;
	}
	.orbit-2 .tech-moon {
		animation-duration: 30s;
	}
	.orbit-3 .tech-moon {
		animation-duration: 35s;
	}
	.orbit-4 .tech-moon {
		animation-duration: 40s;
	}

	.tech-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
	}

	/* Moon positions */
	.position-top {
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
	}

	.position-right {
		top: 50%;
		right: -20px;
		transform: translateY(-50%);
	}

	.position-bottom {
		bottom: -20px;
		left: 50%;
		transform: translateX(-50%);
	}

	.position-left {
		top: 50%;
		left: -20px;
		transform: translateY(-50%);
	}

	@keyframes orbit-rotation {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	/* counter rotation for moons to keep icons upright */
	@keyframes counter-orbit-rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(-360deg);
		}
	}

	@media (--md-n-below) {
		.planet-container {
			width: 380px;
			height: 380px;
		}

		.planet {
			width: 80px;
			height: 80px;
		}

		.orbit-1 {
			width: 120px;
			height: 120px;
		}

		.orbit-2 {
			width: 190px;
			height: 190px;
		}

		.orbit-3 {
			width: 260px;
			height: 260px;
		}

		.orbit-4 {
			width: 330px;
			height: 330px;
		}

		.tech-moon {
			width: 30px;
			height: 30px;
		}

		.position-top {
			top: -15px;
		}

		.position-right {
			right: -15px;
		}

		.position-bottom {
			bottom: -15px;
		}

		.position-left {
			left: -15px;
		}
	}
</style>
