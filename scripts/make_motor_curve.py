max_rpm = 5676
free_current = 1.8
stall_current = 105
stall_torque = 2.6
peak_power = 406

headers = "Speed (RPM),Torque (N·m),Current (A),Supplied Power (W),Output Power (W),Efficiency (%),Power Dissipation (W)\n"
file = open("motor_data/neo-curve-data.csv", "w+")
file.write(headers)

for rpm in list(range(0, max_rpm-1, 50)) + [max_rpm]:
    progress_percentage = (1 - (rpm / max_rpm))
    line = [
        rpm,
        stall_torque * progress_percentage,
        stall_current * progress_percentage,
        0,
        rpm * 0.285412262 - 0.000050284049*rpm**2,
        0,
        0
    ]
    file.write(",".join([str(e) for e in line]) + "\n")

file.close()

