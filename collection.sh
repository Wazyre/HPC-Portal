#!/bin/bash

# Statistics Path Locations
# ==========================
# stat_path=/NFS/shared/homes/WebSites/PORTAL

#SLURM Job Log statistics                                                                          
#========================                                                                          
job_sta_file=slurmJobs.json
sacct -aX --starttime=2024-01-01 --format=JobID,JobName%15,User%15,Partition,State,Start,ElapsedRaw > $job_sta_file  

# #Get Users Statistics
# #=====================
user_path=/NFS/scratch/homes
user_list=( $(sacctmgr show users format=User%15 DefaultAccount=default | tail -n +3 ) )

# 1) Format - Last six months
# ---------------------------

#declare -a sta_months
for i in {0..5}; do
	j=$((i - 5))
	y=$(date +%Y)
	m=$( (date -d "$(date +%Y-%m-1) $j month" +%m))
	sta_months[$i]="${y}-${m}"
	month_year[$i]="${y}-$(date -d "2000-$m-01" +%B)"
	month_name[$i]="$(date -d "2000-$m-01" +%B)"
done

# 2) Storage Size
# ---------------
output_file=userStorage.json
> $output_file
scratchUsed=$(df | grep scratch | awk '{print $3}')
sharedUsed=$(df | grep shared | awk '{print $3}')
echo "{" >> $output_file
echo "\"scratchUsed\": $scratchUsed," >> $output_file
echo "\"sharedUsed\": $sharedUsed," >> $output_file

for item in "${user_list[@]}"; do
	# user_8s="${item:0:8}"
	total_size=$(find $user_path/$item -printf '%TY-%TB %s\n' | awk '{b[$1]+=$2} \
			END{for (date in b){ split(date,d,"-"); print d[1],d[2],b[date];}}' | sort -k 1n -k 2M \
			| awk '{if (NR>1) {print prev} prev="\""$1"-"$2"\": "$3","} END {print "\""$1"-"$2"\": "$3}')
	# total_size=$(du -bs $user_path/$item | awk '{print $1}' )
	echo "\"$item\": {$total_size}," >> $output_file
done
sed -i '$ s/.$//' $output_file                           
echo "}" >> $output_file

# 3) Submitted Jobs
# -----------------
output_file=userJobs.json
> $output_file

echo "[" >> $output_file
for item in "${user_list[@]}"; do
	echo "{" >> $output_file
	# user_8s="${item:0:8}"
	echo "\"name\": \"$item\", " >> $output_file
	for (( i=0; i<${#sta_months[@]}; i++ )); do
		echo "\"${month_year[$i]}\": {" >> $output_file
		line_count=$(grep $item $job_sta_file | grep -o ${sta_months[i]} | wc -l)
		echo "\"jobs\": $line_count," >> $output_file
		time_count=$(grep $item $job_sta_file | grep ${sta_months[i]} | awk '{print $7}' | paste -s -d+ | bc)
		if [[ -z "$time_count" ]]; then
			time_count=0
		fi
		echo "\"time\": $time_count" >> $output_file
		echo "}," >> $output_file
	done
	sed -i '$ s/.$//' $output_file                           
	echo "}," >> $output_file
done
sed -i '$ s/.$//' $output_file
echo "]" >> $output_file

#Get Job Statistics
#==================
                                                                                             
# for (( i=0; i<${#sta_months[@]}; i++ )); do
# 	line_count=$(grep -o ${sta_months[i]} $job_sta_file | wc -l) 
# 	for item in "${user_list[@]}"; do
# 		user_8s="${item:0:8}"
# 		userMonths=$(grep -o ${sta_months[i]} $job_sta_file | grep -o $user_8s | wc -l)                                   
# 		echo "$item		$userMonths" >> $output_file
# 	done
	                         
# 	echo "${month_name[i]}: $line_count" >> $output_file                                            
# done 

#2) Job State Per Month
#----------------------
output_file=jobsStat.json
> $output_file
total_count=$(( $(wc -l < $job_sta_file) - 2))

string_to_find=("Completed" "Failed" "Cancelled" "Running" "Pending")
other_count=0
echo "{" >> $output_file
# echo "Total: $total_count" > $output_file

for (( i=0; i<${#sta_months[@]}; i++ )); do
	echo "\"${month_name[i]}\": {" >> $output_file
	for search_string in "${string_to_find[@]}"; do
		line_count=$(grep $search_string $job_sta_file | grep -o ${sta_months[i]} | wc -l)
		echo "\"$search_string\": $line_count," >> $output_file
	done
	line_count=$(grep -o ${sta_months[i]} $job_sta_file | wc -l)
	echo "\"Total\": $line_count" >> $output_file
	echo "}," >> $output_file
done
sed -i '$ s/.$//' $output_file
echo "}" >> $output_file

# other_count=$((total_count - other_count))
# echo "Other: $other_count" >> $output_file

#3) Job Partitions Per Month
#---------------------------
output_file=jobsPartition.json                                                       
> $output_file                      
echo "{" >> $output_file
                                                                                             
part_array=("def1" "Res" "Dev")
cluster_array=("Project" "Research" "Developer")

for (( j=0; j<${#sta_months[@]}; j++ )); do     
	echo "\"${month_name[j]}\": {" >> $output_file
	for (( i=0; i<${#part_array[@]}; i++ )); do
		line_count=$(grep ${part_array[i]} $job_sta_file | grep -o ${sta_months[j]} | wc -l)
		echo "\"${cluster_array[i]}\": $line_count," >> $output_file
	done
	line_count=$(grep -o ${sta_months[j]} $job_sta_file | wc -l)
    echo "\"Total\": $line_count" >> $output_file
	echo "}," >> $output_file                                   
done     
sed -i '$ s/.$//' $output_file
echo "}" >> $output_file

#Get Resource Statistics
#==================

# 1) Node and CPU Status
#-----------------------
output_file=nodeInfo.json

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
echo "}" >> $output_file


exit 0
