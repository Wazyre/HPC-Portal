#!/bin/bash
#Get Resource Statistics
#==================

# 1) Node and CPU Status
#-----------------------
output_file=liveResources.json
part_array=("def1" "Res" "Dev")
cluster_array=("Project" "Research" "Developer")

sed -i '$ s/.$//' $output_file

if read -n1 char <"$output_file"; [[ $char != "[" ]]; then
    echo "[" >> $output_file
    echo "{" >> $output_file
    for (( i=0; i<${#part_array[@]}; i++ )); do
        echo "\"${cluster_array[i]}\": {" >> $output_file
        cpuState=$(sinfo -o "%.10P %.15C %.15F" | grep ${part_array[i]} | awk '{print $2}')
        nodeState=$(sinfo -o "%.10P %.15C %.15F" | grep ${part_array[i]} | awk '{print $3}')
        echo "\"cpuState\": \"$cpuState\"," >> $output_file
        echo "\"nodeState\": \"$nodeState\"" >> $output_file
        echo "}," >> $output_file
    done
    sed -i '$ s/.$//' $output_file
    echo "}]" >> $output_file
else
    sed -i '$ s/$/,/ ' $output_file
    echo "{" >> $output_file
    for (( i=0; i<${#part_array[@]}; i++ )); do
        echo "\"${cluster_array[i]}\": {" >> $output_file
        cpuState=$(sinfo -o "%.10P %.15C %.15F" | grep ${part_array[i]} | awk '{print $2}')
        nodeState=$(sinfo -o "%.10P %.15C %.15F" | grep ${part_array[i]} | awk '{print $3}')
        echo "\"cpuState\": \"$cpuState\"," >> $output_file
        echo "\"nodeState\": \"$nodeState\"" >> $output_file
        echo "}," >> $output_file
    done
    sed -i '$ s/.$//' $output_file
    echo "}]" >> $output_file
fi

exit 0

