package ro.tuc.ds2020.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.tuc.ds2020.entity.Measurement;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public interface MeasurementRepository extends JpaRepository<Measurement, UUID> {
    ArrayList<Measurement> findTop6ByDeviceUuidOrderByTimestampDesc(UUID uuid);

    @Query("select m from Measurement m where m.deviceUuid = ?1 and m.timestamp between ?2 and ?3 order by m.timestamp asc")
    List<Measurement> findByDeviceUuidAndTimestampBetween(UUID uuid, LocalDateTime timestampStart, LocalDateTime timestampEnd);

}
