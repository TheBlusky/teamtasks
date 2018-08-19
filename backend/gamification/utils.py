def xp_needed_for_level_up(level):
    stage = int((level - 1) / 4)
    step = level - (stage * 4) - 1
    gap = (stage + 1) * 5
    fix = 10
    for i in range(stage):
        fix += (i + 1) * 4 * 5
    return fix + step * gap


def hp_max_with_level(level):
    return 20 + (level - 1) * 2
