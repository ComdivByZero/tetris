love.load = function()
	logic = require("logic")
	draw = require("draw")
	GS_PLAY		= 0
	GS_PAUSE	= 1
	GS_END		= 2
	game = {
		state = GS_PLAY,
		step = 0.3,
		dstep = 0.00001,
		tstep = 0.3,
		multstep = 1,
		pressedLeft = 0,
		pressedRight = 0,
		pressedStep = 0.1,
		pressedTStep = 0.1 * 2,
		tetris = logic.createClassic()
	}
	draw.init(game.tetris)
	math.randomseed(os.time())
	logic.addFigureRandom(game.tetris)
end

love.draw = function()
	draw.tetris(game.tetris)
end

love.update = function(dt)
	local dx
	if game.state == GS_PLAY then
		game.tstep = game.tstep - dt * game.multstep
		game.step = game.step - game.dstep
		if game.tstep <= 0 then
			if not logic.tryToMoveCurrentFigure(game.tetris, 0, 1) then
				game.multstep = 1
				logic.embedCurrentFigureIntoField(game.tetris)
				logic.removeCompletedLines(game.tetris)
				if not logic.addFigureRandom(game.tetris) then
					game.state = GS_END
				end
			end
			game.tstep = game.step
		end
		
		dx = game.pressedLeft + game.pressedRight
		if dx ~= 0 then
			game.pressedTStep = game.pressedTStep - dt
			if game.pressedTStep < 0 then
				logic.tryToMoveCurrentFigure(game.tetris, dx, 0)
				game.pressedTStep = game.pressedStep
			end
		end
	end
end

love.keypressed = function(key)
	if key == "escape" then
		love.event.quit()
	elseif key == "n" or key == "N" then
		love.load() 
	elseif game.state == GS_END then
	
	elseif game.state == GS_PAUSE then
		game.state = GS_PLAY
	elseif key == "up" then
		logic.tryToRotateCurrentFigure(game.tetris)
	elseif key == "down" then
		game.multstep = 8
	elseif key == "left" then
		logic.tryToMoveCurrentFigure(game.tetris, -1, 0)
		game.pressedLeft = -1
		game.pressedTStep = game.pressedStep * 3
	elseif key == "right" then
		logic.tryToMoveCurrentFigure(game.tetris, 1, 0)
		game.pressedRight = 1
		game.pressedTStep = game.pressedStep * 3
	elseif key == "p" or key == "P" then
		game.state = GS_PAUSE
	end
end

love.keyreleased = function(key)
	if key == "down" then
		game.multstep = 1
	elseif key == "left" then
		game.pressedLeft = 0
	elseif key == "right" then
		game.pressedRight = 0
	end
end
