package com.ckinan.cliff;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface TrackRepository extends JpaRepository<TrackEntity, Long> {


    @Query(value="select sum(counter\\:\\:numeric) as counter,\n" +
            "        date_trunc('hour', createdat) as date\n" +
            "        from track\n" +
            "        where createdat\\:\\:date >= to_date(:startDate,'YYYY-MM-DD')\n" +
            "          and createdat\\:\\:date <= to_date(:endDate,'YYYY-MM-DD')\n" +
            "        group by date_trunc('hour', createdat)\n" +
            "        order by 2",
            nativeQuery=true)
    List<Map<String, Object>> findTracksByCreatedAtDateRange(@Param("startDate") String startDate, @Param("endDate") String endDate);

}
