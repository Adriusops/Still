import Skeleton from '../ui/Skeleton'
import styles from './FeedSkeleton.module.css'

function SkeletonItem() {
  return (
    <div className={styles.item}>
      <div className={styles.content}>
        <Skeleton width="80px" height="11px" />
        <Skeleton width="100%" height="15px" />
        <Skeleton width="60%" height="15px" />
        <Skeleton width="50px" height="11px" />
      </div>
      <Skeleton width="80px" height="80px" />
    </div>
  )
}

export default function FeedSkeleton() {
  return (
    <div>
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </div>
  )
}
