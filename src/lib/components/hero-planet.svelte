<div class="planet-container">
	<div class="planet">
		<div class="planet-shadow"></div>
	</div>
	<div class="orbit">
		<div class="moon"></div>
	</div>
</div>

<style>
	.planet-container {
		position: relative;
		width: 200px;
		height: 200px;
		margin: var(--gap) 0;
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

	.orbit {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 180px;
		height: 180px;
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--text-2) 50%, transparent);
		animation: orbit-rotation 20s linear infinite;
	}

	.moon {
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: var(--text-2);
	}

	@keyframes orbit-rotation {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	@media (--md-n-below) {
		.planet-container {
			width: 150px;
			height: 150px;
		}

		.planet {
			width: 80px;
			height: 80px;
		}

		.orbit {
			width: 140px;
			height: 140px;
		}
	}
</style>
